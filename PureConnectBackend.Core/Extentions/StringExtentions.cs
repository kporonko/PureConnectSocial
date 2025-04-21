using PureConnectBackend.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;

namespace PureConnectBackend.Core.Extentions
{
    public static class StringExtentions
    {
        /// <summary>
        /// Converts password string to hash.
        /// </summary>
        /// <param name="password">Entered password.</param>
        /// <returns>Hash of password.</returns>
        public static string ConvertPasswordToHash(this string password)
        {
            using SHA256 sha256Hash = SHA256.Create();
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }


        /// <summary>
        /// Decodes JWT token into user info.
        /// </summary>
        /// <param name="token">JWt token string.</param>
        /// <returns>Token user info.</returns>
        public static TokenCredentials GetCredentialsFromToken(this string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var tokenS = jsonToken as JwtSecurityToken;

            TokenCredentials res = new TokenCredentials();
            res.Email = tokenS.Claims.First(claim => claim.Type == "email").Value;
            res.Name = tokenS.Claims.First(claim => claim.Type == "name").Value;
            res.Picture = tokenS.Claims.First(claim => claim.Type == "picture").Value;
            res.FirstName = tokenS.Claims.First(claim => claim.Type == "given_name").Value;
            res.LastName = tokenS.Claims.First(claim => claim.Type == "family_name").Value;

            return res;
        }
    }
}
