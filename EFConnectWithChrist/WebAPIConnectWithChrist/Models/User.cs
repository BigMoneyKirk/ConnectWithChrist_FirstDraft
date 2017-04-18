using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAPIConnectWithChrist.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string phoneNumber { get; set; }
        public int mainBusinessID { get; set; }
        public System.DateTime dayAndTimeJoined { get; set; }
        public int UserType { get; set; }
        public virtual MainBusiness MainBusiness { get; set; }
        public virtual UserType UserType1 { get; set; }
    }
}