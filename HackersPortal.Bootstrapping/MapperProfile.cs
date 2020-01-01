using AutoMapper;
using HackersPortal.Contracts.Documents;
using HackersPortal.DataBaseModal.Documents;
using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Bootstrapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<DocumentModel, Documents>().ReverseMap();
            CreateMap<CreateDocument, DocumentModel>();
            CreateMap<DocumentPermissionModel, DocumentPermissions>().ReverseMap();
            CreateMap<CreateUpdateDocumentPermission, DocumentPermissionModel>();
        }        
    }
}
