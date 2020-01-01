using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Contracts.Account
{
    public class UserModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsLockout { get; set; }
    }
}
