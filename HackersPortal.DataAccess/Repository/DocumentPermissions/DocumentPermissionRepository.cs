using AutoMapper;
using HackersPortal.Contracts.Documents;
using HackersPortal.DataAccess.EntityFrameworkCore;
using HackersPortal.DataBaseModal.Documents;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HackersPortal.DataAccess.Repository.Documents
{
    public class DocumentPermissionRepository : IDocumentPermissionRepository
    {
        private readonly HackersPortalDbContext _context;

        public DocumentPermissionRepository(HackersPortalDbContext context)
        {
            _context = context;
        }

        public async Task<DocumentPermissions> Add(DocumentPermissions entity)
        {
            _context.Set<DocumentPermissions>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<DocumentPermissions> Delete(int id)
        {
            var entity = await _context.Set<DocumentPermissions>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            _context.Set<DocumentPermissions>().Remove(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<DocumentPermissions> Get(int id)
        {
            var entity = await _context.Set<DocumentPermissions>().AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            return entity;
        }

        public IQueryable<DocumentPermissions> GetAll()
        {
            return _context.Set<DocumentPermissions>();
        }

        public async Task<List<DocumentPermissions>> GetAllList()
        {
            return await _context.Set<DocumentPermissions>().ToListAsync();
        }

        public async Task<DocumentPermissions> Update(DocumentPermissions entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
