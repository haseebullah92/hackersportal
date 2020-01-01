using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Contracts.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsDeleted { get; set; }
    }
}
