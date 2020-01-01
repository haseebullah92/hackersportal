using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HackersPortal.Contracts.Account;
using HackersPortal.Contracts.Identity;
using HackersPortal.Contracts.JWT;
using HackersPortal.Contracts.Response;
using HackersPortal.Contracts.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace HackersPortal.WebApi.Controllers
{    
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        [Authorize(Roles = "Admin,ProjectManager")]
        [HttpGet]
        [Route("GetUsers")]
        public async Task<ResponseModel<List<UserModel>>> GetUsers()
        {
            var users = (await userManager.GetUsersInRoleAsync("User")).ToList();
            if (User.IsInRole("Admin"))
            {
                users.AddRange((await userManager.GetUsersInRoleAsync("ProjectManager")).ToList());
            }
            var result = new List<UserModel>();
            foreach(var user in users)
            {
                result.Add(new UserModel
                {
                    Email = user.Email,
                    FullName = user.FullName,
                    Id = user.Id,
                    Role = (await userManager.GetRolesAsync(user)).FirstOrDefault(),
                    IsLockout = await userManager.IsLockedOutAsync(user)
                });
            }
            return new ResponseModel<List<UserModel>> { Success = true, Data = result.OrderBy(x => x.Role).ToList() };
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("UnlockUser/{id}")]
        public async Task<ResponseModel<dynamic>> UnlockUser(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user != null)
            {
                if (userManager.SupportsUserLockout && await userManager.IsLockedOutAsync(user))
                {
                    await userManager.SetLockoutEndDateAsync(user, new DateTimeOffset(DateTime.Now));
                }
            }
            return new ResponseModel<dynamic> { Success = true };
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("Create")]
        public async Task<ResponseModel<dynamic>> Create([FromBody] CreateUser model)
        {
            var response = new ResponseModel<dynamic>() {
                Success = true,
                Message = ""
            };
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                Email = model.UserName,
                UserName = model.UserName
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = result.Errors.FirstOrDefault().Description;
                return response;
            }
            result = await userManager.AddToRoleAsync(user, model.Role);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = result.Errors.FirstOrDefault().Description;
                return response;
            }
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("Update")]
        public async Task<ResponseModel<dynamic>> Update([FromBody] UpdateUser model)
        {
            var response = new ResponseModel<dynamic>()
            {
                Success = true,
                Message = ""
            };
            var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == model.Id);
            user.FullName = model.FullName;
            user.Email = model.UserName;
            user.UserName = model.UserName;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = result.Errors.FirstOrDefault().Description;
                return response;
            }

            if(!await userManager.IsInRoleAsync(user, model.Role))
            {
                var roles = (await userManager.GetRolesAsync(user));
                result = await userManager.RemoveFromRolesAsync(user, roles);
                if (!result.Succeeded)
                {
                    response.Success = false;
                    response.Message = result.Errors.FirstOrDefault().Description;
                    return response;
                }
                result = await userManager.AddToRoleAsync(user, model.Role);
                if (!result.Succeeded)
                {
                    response.Success = false;
                    response.Message = result.Errors.FirstOrDefault().Description;
                    return response;
                }
            }            

            if(!string.IsNullOrEmpty(model.Password))
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                result = await userManager.ResetPasswordAsync(user, token, model.Password);
                if (!result.Succeeded)
                {
                    response.Success = false;
                    response.Message = result.Errors.FirstOrDefault().Description;
                    return response;
                }
            }

            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("Delete/{Id}")]
        public async Task<ResponseModel<dynamic>> Delete(string Id)
        {
            var response = new ResponseModel<dynamic>()
            {
                Success = true,
                Message = ""
            };
            var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == Id);
            user.IsDeleted = true;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = result.Errors.FirstOrDefault().Description;
                return response;
            }

            return response;
        }
    }
}