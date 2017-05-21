using EFConnectWithChrist;
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

namespace WebAPIConnectWithChrist.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserTypesController : ApiController
    {
        private ConnectWithChristEntities db = new ConnectWithChristEntities();

        [HttpGet]
        [ActionName("GetAllUserTypes")]
        [Route("api/UserTypes/GetAllUserTypes")]
        [ResponseType(typeof(UserType))]
        public HttpResponseMessage GetAllUserTypes()
        {
            try
            {
                List<UserType> temp = db.UserTypes.ToList();
                List<MOD.UserType> userTypeList = new List<MOD.UserType>();

                foreach (var usertype in temp)
                {
                    NLogConfig.logger.Log(new LogEventInfo(LogLevel.Info, "Log_UsersController", $" {usertype.UserTypeName} is a usertype with ID {usertype.UserTypeID}."));
                    userTypeList.Add(AutoMapper.Mapper.Map<MOD.UserType>(usertype));
                }
                return Request.CreateResponse(HttpStatusCode.OK, userTypeList);
            }

            catch (InvalidOperationException ex)
            {
                NLogConfig.logger.Error(ex, $"For some reason, the mapper is not being initialized.");
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            catch (Exception ex)
            {
                NLogConfig.logger.Error(ex, $"There is an error with the api routing.");
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        // GET: api/UserTypes
        public IQueryable<UserType> GetUserTypes()
        {
            return db.UserTypes;
        }

        // GET: api/UserTypes/5
        [ResponseType(typeof(UserType))]
        public async Task<IHttpActionResult> GetUserType(int id)
        {
            UserType userType = await db.UserTypes.FindAsync(id);
            if (userType == null)
            {
                return NotFound();
            }

            return Ok(userType);
        }

        // PUT: api/UserTypes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUserType(int id, UserType userType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userType.UserTypeID)
            {
                return BadRequest();
            }

            db.Entry(userType).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTypeExists(id))
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

        // POST: api/UserTypes
        [ResponseType(typeof(UserType))]
        public async Task<IHttpActionResult> PostUserType(UserType userType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserTypes.Add(userType);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = userType.UserTypeID }, userType);
        }

        // DELETE: api/UserTypes/5
        [ResponseType(typeof(UserType))]
        public async Task<IHttpActionResult> DeleteUserType(int id)
        {
            UserType userType = await db.UserTypes.FindAsync(id);
            if (userType == null)
            {
                return NotFound();
            }

            db.UserTypes.Remove(userType);
            await db.SaveChangesAsync();

            return Ok(userType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserTypeExists(int id)
        {
            return db.UserTypes.Count(e => e.UserTypeID == id) > 0;
        }
    }
}