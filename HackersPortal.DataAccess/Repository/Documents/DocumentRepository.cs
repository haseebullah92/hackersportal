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
    public class DocumentRepository : IDocumentRepository
    {
        private readonly HackersPortalDbContext _context;

        public DocumentRepository(HackersPortalDbContext context)
        {
            _context = context;
        }

        public async Task<DataBaseModal.Documents.Documents> Add(DataBaseModal.Documents.Documents entity)
        {
            _context.Set<DataBaseModal.Documents.Documents>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<DataBaseModal.Documents.Documents> Delete(int id)
        {
            var entity = await _context.Set<DataBaseModal.Documents.Documents>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            _context.Set<DataBaseModal.Documents.Documents>().Remove(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<DataBaseModal.Documents.Documents> Get(int id)
        {
            var entity = await _context.Set<DataBaseModal.Documents.Documents>().AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            return entity;
        }

        public IQueryable<DataBaseModal.Documents.Documents> GetAll()
        {
            return _context.Set<DataBaseModal.Documents.Documents>();
        }

        public async Task<List<DataBaseModal.Documents.Documents>> GetAllList()
        {
            return await _context.Set<DataBaseModal.Documents.Documents>().AsNoTracking().Where(x => !x.IsDeleted).ToListAsync();
        }

        public async Task<DataBaseModal.Documents.Documents> Update(DataBaseModal.Documents.Documents entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
