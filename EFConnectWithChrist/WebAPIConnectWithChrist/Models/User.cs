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
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int MainBusinessID { get; set; }
        public string MainBusiness { get; set; }
        public System.DateTime dayAndTimeJoined { get; set; }
        public int UserTypeID { get; set; }
        public string UserType { get; set; }
    }
}