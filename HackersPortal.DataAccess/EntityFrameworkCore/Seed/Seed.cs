using HackersPortal.Contracts.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HackersPortal.DataAccess.EntityFrameworkCore.Seed
{
    public static class Seed
    {
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                IdentityRole role = new IdentityRole();
                role.Name = "Admin";
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }
            if (!await roleManager.RoleExistsAsync("ProjectManager"))
            {
                IdentityRole role = new IdentityRole();
                role.Name = "ProjectManager";
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }            
            if (!await roleManager.RoleExistsAsync("User"))
            {
                IdentityRole role = new IdentityRole();
                role.Name = "User";
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }
        }

        public static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager)
        {
            if (!await userManager.Users.AnyAsync(x => x.UserName == "admin@test.com"))
            {
                var user = new ApplicationUser
                {
                    UserName = "admin@test.com",
                    FullName = "Admin",
                    Email = "admin@test.com"
                };
                await userManager.CreateAsync(user, "admin123");
                await userManager.AddToRoleAsync(user, "Admin");
            }            
        }
    }
}
