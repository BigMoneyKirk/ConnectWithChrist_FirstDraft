using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EFConnectWithChrist
{
    public class Class1
    {
        public static void Main()
        {
            using (ConnectWithChristEntities con = new ConnectWithChristEntities())
            {
                User me = new User { Firstname = "Stephen", Lastname = "Kirkland", email = "sk@revature.com", password = "stephen", mainBusinessID = 1, UserID = 1, UserType = 1};
                con.Users.Add(me);
                con.SaveChanges();
            }
        }
    }
}
