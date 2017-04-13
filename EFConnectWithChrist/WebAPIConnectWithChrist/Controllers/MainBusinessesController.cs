using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebAPIConnectWithChrist.Models;

namespace WebAPIConnectWithChrist.Controllers
{
    public class MainBusinessesController : ApiController
    {
        private WebAPIConnectWithChristContext db = new WebAPIConnectWithChristContext();

        // GET: api/MainBusinesses
        public IQueryable<MainBusiness> GetMainBusinesses()
        {
            return db.MainBusinesses;
        }

        // GET: api/MainBusinesses/5
        [ResponseType(typeof(MainBusiness))]
        public async Task<IHttpActionResult> GetMainBusiness(int id)
        {
            MainBusiness mainBusiness = await db.MainBusinesses.FindAsync(id);
            if (mainBusiness == null)
            {
                return NotFound();
            }

            return Ok(mainBusiness);
        }

        // PUT: api/MainBusinesses/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutMainBusiness(int id, MainBusiness mainBusiness)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != mainBusiness.mainBusinessID)
            {
                return BadRequest();
            }

            db.Entry(mainBusiness).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MainBusinessExists(id))
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

        // POST: api/MainBusinesses
        [ResponseType(typeof(MainBusiness))]
        public async Task<IHttpActionResult> PostMainBusiness(MainBusiness mainBusiness)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.MainBusinesses.Add(mainBusiness);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = mainBusiness.mainBusinessID }, mainBusiness);
        }

        // DELETE: api/MainBusinesses/5
        [ResponseType(typeof(MainBusiness))]
        public async Task<IHttpActionResult> DeleteMainBusiness(int id)
        {
            MainBusiness mainBusiness = await db.MainBusinesses.FindAsync(id);
            if (mainBusiness == null)
            {
                return NotFound();
            }

            db.MainBusinesses.Remove(mainBusiness);
            await db.SaveChangesAsync();

            return Ok(mainBusiness);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MainBusinessExists(int id)
        {
            return db.MainBusinesses.Count(e => e.mainBusinessID == id) > 0;
        }
    }
}