using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Contracts.Documents
{
    public class DocumentPermissionModel
    {
        public int? Id { get; set; }
        public int DocumentId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public bool CanView { get; set; }
        public bool CanEdit { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
