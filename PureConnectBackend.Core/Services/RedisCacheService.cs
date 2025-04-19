using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using PureConnectBackend.Core.Interfaces;
using System;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class RedisCacheService : ICacheService
    {
        private readonly IDistributedCache _cache;
        private readonly IConfiguration _configuration;
        private readonly TimeSpan _defaultCacheTime;

        public RedisCacheService(IDistributedCache cache, IConfiguration configuration)
        {
            _cache = cache;
            _configuration = configuration;

            int defaultCacheMinutes = 10; // значение по умолчанию
            if (int.TryParse(_configuration["Redis:DefaultCacheTime"], out int configValue))
            {
                defaultCacheMinutes = configValue;
            }

            _defaultCacheTime = TimeSpan.FromMinutes(defaultCacheMinutes);
        }

        public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null)
        {
            var cachedData = await _cache.GetStringAsync(key);

            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonConvert.DeserializeObject<T>(cachedData);
            }

            var data = await factory();

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? _defaultCacheTime
            };

            await _cache.SetStringAsync(
                key,
                JsonConvert.SerializeObject(data),
                options);

            return data;
        }

        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }

        public async Task<bool> ExistsAsync(string key)
        {
            return await _cache.GetStringAsync(key) != null;
        }
    }
}