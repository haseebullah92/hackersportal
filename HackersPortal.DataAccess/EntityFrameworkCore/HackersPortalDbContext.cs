using HackersPortal.Contracts.Identity;
using HackersPortal.DataBaseModal.Documents;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.DataAccess.EntityFrameworkCore
{
    public class HackersPortalDbContext : IdentityDbContext<ApplicationUser>
    {
        public HackersPortalDbContext(DbContextOptions<HackersPortalDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Documents> Documents { get; set; }
        public virtual DbSet<DocumentPermissions> DocumentPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().Property<bool>("IsDeleted");
            builder.Entity<ApplicationUser>().HasQueryFilter(m => EF.Property<bool>(m, "IsDeleted") == false);
        }
    }
}
