using HackersPortal.DataAccess.EntityFrameworkCore;
using HackersPortal.Infrastructure.Documents;
using HackersPortal.DataBaseModal.Documents;
using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using HackersPortal.Contracts.Documents;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using HackersPortal.Contracts.Identity;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HackersPortal.DataAccess.Repository.Documents;

namespace HackersPortal.Service.Documents
{
    public class DocumentService : IDocumentService
    {
        private readonly IMapper _mapper;
        private readonly IDocumentRepository _documentRepository;
        private readonly IDocumentPermissionRepository _documentPermissionRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public DocumentService(IMapper mapper, 
            IDocumentRepository documentRepository,
            IDocumentPermissionRepository documentPermissionRepository,
            UserManager<ApplicationUser> userManager)
        {
            _mapper = mapper;
            _documentRepository = documentRepository;
            _documentPermissionRepository = documentPermissionRepository;
            _userManager = userManager;
        }

        public async Task Create(DocumentModel model)
        {
            var document = _mapper.Map<DataBaseModal.Documents.Documents>(model);
            await _documentRepository.Add(document);
        }

        public async Task Update(DocumentModel model)
        {
            var document = _mapper.Map<DataBaseModal.Documents.Documents>(model);
            await _documentRepository.Update(document);
        }

        public async Task Delete(int id, string userId)
        {
            var document = await _documentRepository.Get(id);
            document.IsDeleted = true;
            document.DeletedBy = userId;
            document.DeletedOn = DateTime.Now;
            await _documentRepository.Update(document);
        }

        public async Task<DocumentModel> Get(int Id)
        {
            return _mapper.Map<DocumentModel>(await _documentRepository.Get(Id));
        }

        public async Task<List<DocumentModel>> GetAllByCreatedBy(string userId)
        {
            var documents = await _documentRepository.GetAll().Where(x => x.CreatedBy == userId && !x.IsDeleted).ToListAsync();
            var userIds = documents.Select(x => x.ModifiedBy).ToList();
            var users = await _userManager.Users.Where(x => userIds.Contains(x.Id)).ToListAsync();
            return documents.Select(x => new DocumentModel
            {
                Id = x.Id,
                Name = x.Name,
                MetaTags = x.MetaTags,
                Content = x.Content,
                CreatedBy = x.CreatedBy,
                CreatedOn = x.CreatedOn,
                ModifiedBy = x.ModifiedBy,
                ModifiedByName = users.Where(y => y.Id == x.ModifiedBy).Select(y => y.FullName).FirstOrDefault(),
                ModifiedOn = x.ModifiedOn,
                CanEdit = true,
                CanManage = true
            }).ToList();
        }

        public async Task<List<DocumentModel>> GetOtherDocuments(string userId, string role)
        {
            var documents = new List<DocumentModel>();
            if (role == "Admin")
            {
                var adminUsers = (await _userManager.GetUsersInRoleAsync("Admin")).Select(x => x.Id).ToList();
                documents = await _documentRepository.GetAll().Where(x => x.CreatedBy != userId && !adminUsers.Contains(x.CreatedBy) && !x.IsDeleted)
                    .Select(x => new DocumentModel {
                        Id = x.Id,
                        Name = x.Name,
                        MetaTags = x.MetaTags,
                        Content = x.Content,
                        CreatedBy = x.CreatedBy,
                        CreatedOn = x.CreatedOn,
                        ModifiedBy = x.ModifiedBy,
                        ModifiedOn = x.ModifiedOn,
                        CanEdit = true,
                        CanManage = true
                    })
                    .ToListAsync();
                documents.AddRange(await (from per in _documentPermissionRepository.GetAll().Where(x => x.CanView && x.UserId == userId)
                                          join docu in _documentRepository.GetAll().Where(x => x.CreatedBy != userId && adminUsers.Contains(x.CreatedBy) && !x.IsDeleted) on per.DocumentId equals docu.Id
                                          select new { docu, per })
                                          .Select(x => new DocumentModel
                                          {
                                              Id = x.docu.Id,
                                              Name = x.docu.Name,
                                              MetaTags = x.docu.MetaTags,
                                              Content = x.docu.Content,
                                              CreatedBy = x.docu.CreatedBy,
                                              CreatedOn = x.docu.CreatedOn,
                                              ModifiedBy = x.docu.ModifiedBy,
                                              ModifiedOn = x.docu.ModifiedOn,
                                              CanEdit = x.per.CanEdit,
                                              CanManage = false
                                          })
                                          .ToListAsync());
            }
            else if (role == "ProjectManager")
            {
                var users = (await _userManager.GetUsersInRoleAsync("User")).Select(x => x.Id).ToList();
                documents = await _documentRepository.GetAll().Where(x => x.CreatedBy != userId && users.Contains(x.CreatedBy) && !x.IsDeleted)
                    .Select(x => new DocumentModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        MetaTags = x.MetaTags,
                        Content = x.Content,
                        CreatedBy = x.CreatedBy,
                        CreatedOn = x.CreatedOn,
                        ModifiedBy = x.ModifiedBy,
                        ModifiedOn = x.ModifiedOn,
                        CanEdit = true,
                        CanManage = true
                    })
                    .ToListAsync();
                documents.AddRange(await (from per in _documentPermissionRepository.GetAll().Where(x => x.CanView && x.UserId == userId)
                                          join docu in _documentRepository.GetAll().Where(x => x.CreatedBy != userId && !users.Contains(x.CreatedBy) && !x.IsDeleted) on per.DocumentId equals docu.Id
                                          select new { docu, per })
                                          .Select(x => new DocumentModel
                                          {
                                              Id = x.docu.Id,
                                              Name = x.docu.Name,
                                              MetaTags = x.docu.MetaTags,
                                              Content = x.docu.Content,
                                              CreatedBy = x.docu.CreatedBy,
                                              CreatedOn = x.docu.CreatedOn,
                                              ModifiedBy = x.docu.ModifiedBy,
                                              ModifiedOn = x.docu.ModifiedOn,
                                              CanEdit = x.per.CanEdit,
                                              CanManage = false
                                          })
                                          .ToListAsync());
            }
            else
            {
                documents = await (from per in _documentPermissionRepository.GetAll().Where(x => x.CanView && x.UserId == userId)
                                   join docu in _documentRepository.GetAll().Where(x => x.CreatedBy != userId && !x.IsDeleted) on per.DocumentId equals docu.Id
                                   select new { docu, per })
                                          .Select(x => new DocumentModel
                                          {
                                              Id = x.docu.Id,
                                              Name = x.docu.Name,
                                              MetaTags = x.docu.MetaTags,
                                              Content = x.docu.Content,
                                              CreatedBy = x.docu.CreatedBy,
                                              CreatedOn = x.docu.CreatedOn,
                                              ModifiedBy = x.docu.ModifiedBy,
                                              ModifiedOn = x.docu.ModifiedOn,
                                              CanEdit = x.per.CanEdit,
                                              CanManage = false
                                          })
                                          .ToListAsync();
            }

            var userIds = documents.Select(x => x.CreatedBy).ToList();
            userIds.AddRange(documents.Select(x => x.ModifiedBy));
            var allUsers = await _userManager.Users.Where(x => userIds.Contains(x.Id)).ToListAsync();
            return documents.Select(x => new DocumentModel
            {
                Id = x.Id,
                Name = x.Name,
                MetaTags = x.MetaTags,
                Content = x.Content,
                CreatedBy = x.CreatedBy,
                CreatedByName = allUsers.Where(y => y.Id == x.CreatedBy).Select(y => y.FullName).FirstOrDefault(),
                CreatedOn = x.CreatedOn,
                ModifiedBy = x.ModifiedBy,
                ModifiedByName = allUsers.Where(y => y.Id == x.ModifiedBy).Select(y => y.FullName).FirstOrDefault(),
                ModifiedOn = x.ModifiedOn,
                CanEdit = x.CanEdit,
                CanManage = x.CanManage
            }).ToList();
        }

        public async Task<List<DocumentPermissionModel>> GetAllDocumentPermissions(string userId, int documentId)
        {
            var document = await _documentRepository.Get(documentId);
            var users = (await _userManager.GetUsersInRoleAsync("User")).ToList();
            if(!users.Any(x => x.Id == document.CreatedBy))
            {
                users.AddRange((await _userManager.GetUsersInRoleAsync("ProjectManager")).ToList());
                if (document.CreatedBy == userId)
                {
                    users.AddRange((await _userManager.GetUsersInRoleAsync("Admin")).ToList());
                }
            }
            users = users.Where(x => x.Id != document.CreatedBy && x.Id != userId).ToList();
            var userIds = users.Select(x => x.Id).ToList();
            var permissions = await _documentPermissionRepository.GetAll()
                .Where(x => x.DocumentId == documentId && userIds.Contains(x.UserId)).ToListAsync();
            return users                
                .Select(x => new DocumentPermissionModel
                {
                    UserId = x.Id,
                    UserName = x.FullName,
                    Id = permissions.FirstOrDefault(y => y.UserId == x.Id)?.Id,
                    DocumentId = documentId,
                    CanEdit = permissions.FirstOrDefault(y => y.UserId == x.Id) != null ?
                                permissions.FirstOrDefault(y => y.UserId == x.Id).CanEdit : false,
                    CanView = permissions.FirstOrDefault(y => y.UserId == x.Id) != null ?
                                permissions.FirstOrDefault(y => y.UserId == x.Id).CanView : false,
                    CreatedBy = permissions.FirstOrDefault(y => y.UserId == x.Id)?.CreatedBy,
                    CreatedOn = permissions.FirstOrDefault(y => y.UserId == x.Id)?.CreatedOn,
                    ModifiedBy = permissions.FirstOrDefault(y => y.UserId == x.Id)?.ModifiedBy,
                    ModifiedOn = permissions.FirstOrDefault(y => y.UserId == x.Id)?.ModifiedOn,
                }).ToList();
        }

        public async Task<List<DocumentPermissionModel>> GetDocumentPermissions(string userId, int documentId)
        {
            var document = await _documentRepository.Get(documentId);
            var users = (await _userManager.GetUsersInRoleAsync("User")).ToList();
            if (!users.Any(x => x.Id == document.CreatedBy) && document.CreatedBy == userId)
            {
                users.AddRange((await _userManager.GetUsersInRoleAsync("ProjectManager")).ToList());
            }
            users = users.Where(x => x.Id != document.CreatedBy && x.Id != userId).ToList();
            var userIds = users.Select(x => x.Id).ToList();
            var permissions = await (from per in _documentPermissionRepository.GetAll().Where(x => x.DocumentId == documentId && userIds.Contains(x.UserId))
                                     join docu in _documentRepository.GetAll().Where(x => x.Id == documentId && !x.IsDeleted) on per.DocumentId equals docu.Id
                                     where per.CreatedBy == userId || docu.CreatedBy == userId
                                     select per).ToListAsync();
            return users
                .Select(x => new DocumentPermissionModel
                {
                    UserId = x.Id,
                    UserName = x.FullName,
                    Id = permissions.FirstOrDefault(y => y.UserId == x.Id)?.Id,
                    DocumentId = documentId,
                    CanEdit = permissions.FirstOrDefault(y => y.UserId == x.Id) != null ?
                                permissions.FirstOrDefault(y => y.UserId == x.Id).CanEdit : false,
                    CanView = permissions.FirstOrDefault(y => y.UserId == x.Id) != null ?
                                permissions.FirstOrDefault(y => y.UserId == x.Id).CanView : false,
                    CreatedBy = permissions.FirstOrDefault(y => y.UserId == x.Id)?.CreatedBy,
                    CreatedOn = permissions.FirstOrDefault(y => y.UserId == x.Id)?.CreatedOn,
                    ModifiedBy = permissions.FirstOrDefault(y => y.UserId == x.Id)?.ModifiedBy,
                    ModifiedOn = permissions.FirstOrDefault(y => y.UserId == x.Id)?.ModifiedOn,
                }).ToList();
        }

        public async Task<DocumentPermissionModel> GetDocumentPermission(int Id)
        {
            return _mapper.Map<DocumentPermissionModel>(await _documentPermissionRepository.Get(Id));
        }

        public async Task CreateDocumentPermission(DocumentPermissionModel model)
        {
            var permission = _mapper.Map<DocumentPermissions>(model);
            await _documentPermissionRepository.Add(permission);
        }

        public async Task UpdateDocumentPermission(DocumentPermissionModel model)
        {
            var permission = _mapper.Map<DocumentPermissions>(model);
            await _documentPermissionRepository.Update(permission);
        }
    }
}
