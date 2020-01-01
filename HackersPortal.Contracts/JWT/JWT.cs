using System;
using System.Collections.Generic;
using System.Text;

namespace HackersPortal.Contracts.JWT
{
    public class JWT
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public int ExpireDays { get; set; }
    }
}
