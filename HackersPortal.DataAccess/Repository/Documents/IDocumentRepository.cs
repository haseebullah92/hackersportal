using HackersPortal.DataBaseModal.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HackersPortal.DataAccess.Repository.Documents
{
    public interface IDocumentRepository
    {
        IQueryable<DataBaseModal.Documents.Documents> GetAll();
        Task<List<DataBaseModal.Documents.Documents>> GetAllList();
        Task<DataBaseModal.Documents.Documents> Get(int id);
        Task<DataBaseModal.Documents.Documents> Add(DataBaseModal.Documents.Documents entity);
        Task<DataBaseModal.Documents.Documents> Update(DataBaseModal.Documents.Documents entity);
        Task<DataBaseModal.Documents.Documents> Delete(int id);
    }
}
