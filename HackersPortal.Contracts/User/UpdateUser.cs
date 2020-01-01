using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HackersPortal.Contracts.User
{
    public class UpdateUser
    {
        [Required(ErrorMessage = "Id is required")]
        public string Id { get; set; }

        [Required(ErrorMessage = "Full Name is required")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "User Name is required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; }

        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Confirm password doesn't match")]
        public string ConfirmPassword { get; set; }
    }
}
