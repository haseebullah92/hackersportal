using HackersPortal.DataBaseModal.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HackersPortal.DataAccess.Repository.Documents
{
    public interface IDocumentPermissionRepository
    {
        IQueryable<DocumentPermissions> GetAll();
        Task<List<DocumentPermissions>> GetAllList();
        Task<DocumentPermissions> Get(int id);
        Task<DocumentPermissions> Add(DocumentPermissions entity);
        Task<DocumentPermissions> Update(DocumentPermissions entity);
        Task<DocumentPermissions> Delete(int id);
    }
}
