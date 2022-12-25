using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class UserLogin
    {
        [Required(ErrorMessage = "You must enter your email address.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "You must enter your password.")]
        [MaxLength(100)]
        [StringLength(50, MinimumLength = 8, ErrorMessage = "Password must contain at least 8 symbols.")]
        public string Password { get; set; }
    }
}
