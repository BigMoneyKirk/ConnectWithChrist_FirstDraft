using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DAL = EFConnectWithChrist;
using MOD = WebAPIConnectWithChrist.Models;

namespace WebAPIConnectWithChrist.Controllers
{
    public static class ConvertEntityToModel
    {
        public static MOD.User convertUser(DAL.User temp)
        {
            return new MOD.User(temp.UserID, temp.Firstname, temp.Lastname, temp.email, temp.password, temp.phoneNumber, temp.mainBusinessID, temp.dayAndTimeJoined, temp.UserType);
        }
    }
}
