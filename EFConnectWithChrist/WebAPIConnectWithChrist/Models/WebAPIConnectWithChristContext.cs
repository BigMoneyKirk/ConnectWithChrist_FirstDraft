using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebAPIConnectWithChrist.Models
{
    public class WebAPIConnectWithChristContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public WebAPIConnectWithChristContext() : base("name=WebAPIConnectWithChristContext")
        {
        }

        public System.Data.Entity.DbSet<WebAPIConnectWithChrist.Models.User> Users { get; set; }

        public System.Data.Entity.DbSet<WebAPIConnectWithChrist.Models.MainBusiness> MainBusinesses { get; set; }

        public System.Data.Entity.DbSet<WebAPIConnectWithChrist.Models.UserType> UserTypes { get; set; }
    }
}
