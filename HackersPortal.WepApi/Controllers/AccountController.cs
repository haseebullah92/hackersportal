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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace HackersPortal.WebApi.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly JWT jwtSettings;

        public AccountController(UserManager<ApplicationUser> userManager, IOptions<JWT> jwtSettings)
        {
            this.userManager = userManager;
            this.jwtSettings = jwtSettings.Value;
        }

        [HttpPost]
        [Route("login")]
        public async Task<ResponseModel<dynamic>> Login([FromBody] LoginModel model)
        {
            var response = new ResponseModel<dynamic>();
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null)
            {
                if (userManager.SupportsUserLockout && await userManager.IsLockedOutAsync(user))
                {
                    return new ResponseModel<dynamic>
                    {
                        Success = false,
                        Message = "Account has been locked out!"
                    };
                }

                if (await userManager.CheckPasswordAsync(user, model.Password))
                {
                    if (userManager.SupportsUserLockout && await userManager.GetAccessFailedCountAsync(user) > 0)
                    {
                        await userManager.ResetAccessFailedCountAsync(user);
                    }

                    var role = (await userManager.GetRolesAsync(user)).FirstOrDefault();
                    var authClaims = new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.Role, role)
                    };

                    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));

                    var token = new JwtSecurityToken(
                        issuer: jwtSettings.Issuer,
                        audience: jwtSettings.Issuer,
                        expires: DateTime.Now.AddHours(3),
                        claims: authClaims,
                        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                        );

                    response = new ResponseModel<dynamic>
                    {
                        Success = true,
                        Message = null,
                        Data = new
                        {
                            name = user.FullName,
                            role,
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            expiration = token.ValidTo
                        }
                    };
                }
                else
                {
                    if (userManager.SupportsUserLockout && await userManager.GetLockoutEnabledAsync(user))
                    {
                        await userManager.AccessFailedAsync(user);
                    }
                    response = new ResponseModel<dynamic>
                    {
                        Success = false,
                        Message = "Invalid email or password!"
                    };
                }
            }
            else
            {
                response = new ResponseModel<dynamic>
                {
                    Success = false,
                    Message = "Invalid email or password!"
                };
            }
            return response;
        }
    }
}