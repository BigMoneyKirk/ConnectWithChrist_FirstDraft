using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAPIConnectWithChrist.Models
{
    public class User
    {
        public User() { }

        public User(int userID, string firstname, string lastname, string email, string password, string phonenumber, int mainbusinessid, DateTime dayAndTimeJoined, int usertypeid)
        {
            UserID = userID;
            Firstname = firstname;
            Lastname = lastname;
            Email = email;
            Password = password;
            PhoneNumber = phonenumber;
            MainBusinessID = mainbusinessid;
            DayAndTimeJoined = dayAndTimeJoined;
            UserTypeID = usertypeid;
        }

        [Key]
        public int UserID { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int MainBusinessID { get; set; }
        public string MainBusiness { get; set; }
        public DateTime DayAndTimeJoined { get; set; }
        public int UserTypeID { get; set; }
        public string UserType { get; set; }
    }
}