using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Contracts.Documents
{
    public class DocumentModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MetaTags { get; set; }
        public string Content { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool? CanEdit { get; set; }
        public bool? CanManage { get; set; }
    }
}
