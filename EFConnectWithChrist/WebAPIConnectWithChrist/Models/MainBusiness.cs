using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAPIConnectWithChrist.Models
{
    public class MainBusiness
    {
        [Key]
        public int mainBusinessID { get; set; }
        public string BusinessName { get; set; }
        public decimal grossIncome { get; set; }
    }
}