using HackersPortal.Contracts.Documents;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HackersPortal.Infrastructure.Documents
{
    public interface IDocumentService
    {
        Task<DocumentModel> Get(int Id);
        Task<List<DocumentModel>> GetAllByCreatedBy(string userId);
        Task<List<DocumentModel>> GetOtherDocuments(string userId, string role);
        Task Create(DocumentModel model);
        Task Update(DocumentModel model);
        Task Delete(int id, string userId);
        Task<DocumentPermissionModel> GetDocumentPermission(int Id);
        Task CreateDocumentPermission(DocumentPermissionModel model);
        Task UpdateDocumentPermission(DocumentPermissionModel model);
        Task<List<DocumentPermissionModel>> GetAllDocumentPermissions(string userId, int documentId);
        Task<List<DocumentPermissionModel>> GetDocumentPermissions(string userId, int documentId);
    }
}
