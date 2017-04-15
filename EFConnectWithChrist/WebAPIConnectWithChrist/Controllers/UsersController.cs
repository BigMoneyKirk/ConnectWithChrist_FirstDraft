using NLog;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using WebAPIConnectWithChrist.App_Start;
using MOD = WebAPIConnectWithChrist.Models;
using EFConnectWithChrist;

namespace WebAPIConnectWithChrist.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private ConnectWithChristEntities db = new ConnectWithChristEntities();

        [HttpGet]
        [ActionName("GetAllUsers")]
        [Route("api/Users/GetAllUsers")]
        [ResponseType(typeof(User))]
        public HttpResponseMessage GetAllUsers()
        {
            try
            {
                var temp = db.Users.ToList();
                List<MOD.User> userList = new List<MOD.User>();
                foreach(User usr in temp)
                {
                    NLogConfig.logger.Log(new LogEventInfo(LogLevel.Info, "Log_UserController", $"User {usr.Firstname} {usr.Lastname} was retrieved."));
                    userList.Add(AutoMapper.Mapper.Map<MOD.User>(usr));
                }
                return Request.CreateResponse(HttpStatusCode.OK, userList);
            }
            catch(InvalidOperationException ex)
            {
                NLogConfig.logger.Error(ex, $"For some reason, the mapper is not be initialized.");
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            catch(Exception ex)
            {
                NLogConfig.logger.Error(ex, $"There is an error with the api routing.");
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("GetUserByEmail")]
        public HttpResponseMessage GetUserByEmail(string email)
        {
            try
            {
                var temp = db.Users.ToList();
                MOD.User user = new MOD.User();
                //foreach (var item in temp)
                //{
                //    if (item.email == email)
                //    {
                //        user = ConvertEntityToModel.convertUser(item);
                //        NLogConfig.logger.Log(new LogEventInfo(LogLevel.Info, "Log_UserController", $"{item.Firstname} {item.Lastname} is the user you are looking for."));
                //    }
                //}
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
            catch (Exception ex)
            {
                NLogConfig.logger.Error(ex, $"There is no user with this email: {email}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.UserID)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.UserID }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.UserID == id) > 0;
        }
    }
}