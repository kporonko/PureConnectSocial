using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class RegisterUserRequest
    {
        [Required]
        [StringLength(50, ErrorMessage = "Username must contain maximum 50 symbols.")]
        public string UserName { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Name must contain maximum 50 symbols.")]
        public string LastName { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Name must contain maximum 50 symbols.")]
        public string FirstName { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }

        [Required(ErrorMessage = "You must enter your email address.")]
        [EmailAddress]
        [StringLength(100, ErrorMessage = "Email must contain maximum 100 symbols.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "You must enter your password.")]
        [StringLength(50, MinimumLength = 8, ErrorMessage = "Password must contain at least 8 symbols.")]
        public string Password { get; set; }

        public string Location { get; set; }
        public string Avatar { get; set; }
    }
}
