using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIConnectWithChrist.Models
{
    public class Passion
    {
        public int passionID { get; set; }
        public string PassionName { get; set; }
        public decimal grossIncome { get; set; }
    }
}