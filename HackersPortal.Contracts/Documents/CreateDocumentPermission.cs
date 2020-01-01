using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Contracts.Documents
{
    public class CreateUpdateDocumentPermission
    {
        public int? Id { get; set; }
        public int DocumentId { get; set; }
        public string UserId { get; set; }
        public int AccessLevel { get; set; }
        public bool Access { get; set; }
    }
}
