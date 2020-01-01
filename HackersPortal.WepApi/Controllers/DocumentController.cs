using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HackersPortal.Contracts.Documents;
using HackersPortal.Contracts.Response;
using HackersPortal.Infrastructure.Documents;
using HackersPortal.WebApi.MvcExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HackersPortal.WebApi.Controllers
{    
    [Route("api/[controller]")]
    public class DocumentController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IDocumentService _documentService;
        public DocumentController(IMapper mapper, IDocumentService documentService)
        {
            _mapper = mapper;
            _documentService = documentService;
        }

        [Authorize]
        [HttpGet]
        [Route("Get/{id}")]
        public async Task<ResponseModel<DocumentModel>> Get(int id)
        {
            return new ResponseModel<DocumentModel> { Success = true, Data = await _documentService.Get(id) };
        }

        [Authorize]
        [HttpGet]
        [Route("GetMyDocuments")]
        public async Task<ResponseModel<List<DocumentModel>>> GetMyDocuments()
        {
            return new ResponseModel<List<DocumentModel>> { Success = true, Data = await _documentService.GetAllByCreatedBy(User.GetUserId()) };
        }

        [Authorize]
        [HttpGet]
        [Route("GetOtherDocuments")]
        public async Task<ResponseModel<List<DocumentModel>>> GetOtherDocuments()
        {
            var documents = await _documentService.GetOtherDocuments(User.GetUserId(), User.GetRole());
            return new ResponseModel<List<DocumentModel>> { Success = true, Data = documents };
        }

        [Authorize]
        [HttpPost]
        [Route("Create")]
        public async Task<ResponseModel<dynamic>> Create([FromBody] CreateDocument model)
        {
            var document = _mapper.Map<DocumentModel>(model);
            document.CreatedBy = User.GetUserId();
            document.CreatedOn = DateTime.Now;
            await _documentService.Create(document);
            return new ResponseModel<dynamic> { Success = true };
        }

        [Authorize]
        [HttpPost]
        [Route("Update")]
        public async Task<ResponseModel<dynamic>> Update([FromBody] UpdateDocument model)
        {
            var document = await _documentService.Get(model.Id);
            document.Name = model.Name;
            document.MetaTags = model.MetaTags;
            document.Content = model.Content;
            document.ModifiedBy = User.GetUserId();
            document.ModifiedOn = DateTime.Now;
            await _documentService.Update(document);
            return new ResponseModel<dynamic> { Success = true };
        }

        [Authorize]
        [HttpGet]
        [Route("Delete/{id}")]
        public async Task<ResponseModel<dynamic>> Delete(int id)
        {
            await _documentService.Delete(id, User.GetUserId());
            return new ResponseModel<dynamic> { Success = true };
        }

        [Authorize(Roles = "Admin,ProjectManager")]
        [HttpGet]
        [Route("GetDocumentPermission/{id}")]
        public async Task<ResponseModel<List<DocumentPermissionModel>>> GetDocumentPermission(int id)
        {
            var permissions = new List<DocumentPermissionModel>();
            if (User.IsInRole("Admin"))
            {
                permissions = await _documentService.GetAllDocumentPermissions(User.GetUserId(), id);
            }
            else
            {
                permissions = await _documentService.GetDocumentPermissions(User.GetUserId(), id);
            }
            return new ResponseModel<List<DocumentPermissionModel>> { Success = true, Data = permissions };
        }

        [Authorize(Roles = "Admin,ProjectManager")]
        [HttpPost]
        [Route("ChangeDocumentPermission")]
        public async Task<ResponseModel<dynamic>> ChangeDocumentPermission([FromBody] CreateUpdateDocumentPermission model)
        {
            var permission = new DocumentPermissionModel();
            if (model.Id != null)
            {
                permission = await _documentService.GetDocumentPermission(Convert.ToInt32(model.Id));
                permission.ModifiedBy = User.GetUserId();
                permission.ModifiedOn = DateTime.Now;
            }
            else
            {
                permission = _mapper.Map<DocumentPermissionModel>(model);
                permission.CreatedBy = User.GetUserId();
                permission.CreatedOn = DateTime.Now;
            }

            if (model.AccessLevel == 1)
            {
                permission.CanEdit = false;
                permission.CanView = model.Access;
            }
            else if (model.AccessLevel == 2)
            {
                permission.CanEdit = model.Access;
                permission.CanView = true;
            }

            if (model.Id != null)
            {                
                await _documentService.UpdateDocumentPermission(permission);
            }
            else
            {
                await _documentService.CreateDocumentPermission(permission);
            }
            return new ResponseModel<dynamic> { Success = true };
        }
    }
}