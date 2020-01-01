using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HackersPortal.Contracts.Documents
{
    public class CreateDocument
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; }
        public string MetaTags { get; set; }
    }
}
