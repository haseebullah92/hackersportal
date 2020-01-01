using AutoMapper;
using HackersPortal.Contracts.Identity;
using HackersPortal.DataAccess;
using HackersPortal.DataAccess.EntityFrameworkCore;
using HackersPortal.DataAccess.Repository.Documents;
using HackersPortal.DependencyResolver;
using HackersPortal.Infrastructure;
using HackersPortal.Infrastructure.Documents;
using HackersPortal.Service;
using HackersPortal.Service.Documents;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleInjector;
using System;
using System.Reflection;

namespace HackersPortal.Bootstrapping
{
    public static class Bootstrapper
    {
        public static void BootStrap(IServiceCollection services, IConfiguration Configuration)
        {
            BootstrapConfigureIdentity(services, Configuration);

            BootstrapDbComponents();

            BootstrapServiceComponents();
        }

        private static void BootstrapConfigureIdentity(IServiceCollection services, IConfiguration Configuration)
        {
            services.AddAutoMapper(typeof(MapperProfile));

            // ===== Add DB Context ========

            services.AddDbContext<HackersPortalDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("HackersPortalDbContext")));

            // ===== Add Identity ========
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {                
                options.Password.RequiredLength = 6;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireLowercase = false;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromHours(365 * 200);
            }).AddEntityFrameworkStores<HackersPortalDbContext>().AddDefaultTokenProviders();
        }

        private static void BootstrapDbComponents()
        {
            Ioc.Container.Register<IDocumentRepository, DocumentRepository>(Lifestyle.Transient);
            Ioc.Container.Register<IDocumentPermissionRepository, DocumentPermissionRepository>(Lifestyle.Transient);
        }

        private static void BootstrapServiceComponents()
        {
            Ioc.Container.Register<IDocumentService, DocumentService>(Lifestyle.Transient);
        }
    }
}