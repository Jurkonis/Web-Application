using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Saityno_back_end;

namespace Saityno_back_end.Controllers
{
    public class TeamsController : ApiController
    {
        private saitynasEntities2 db = new saitynasEntities2();

        // GET: api/Teams
        public IEnumerable<team> Getteams()
        {
            return db.teams.ToList();
        }

        // GET: api/Teams/5
        [ResponseType(typeof(team))]
        public IHttpActionResult Getteam(int id)
        {
            team team = db.teams.Find(id);
            if (team == null)
            {
                return NotFound();
            }

            return Ok(team);
        }

        // PUT: api/Teams/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putteam(int id, team team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != team.id)
            {
                return BadRequest();
            }

            db.Entry(team).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!teamExists(id))
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

        // POST: api/Teams
        [ResponseType(typeof(team))]
        public IHttpActionResult Postteam(team team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.teams.Add(team);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = team.id }, team);
        }

        // DELETE: api/Teams/5
        [ResponseType(typeof(team))]
        public IHttpActionResult Deleteteam(int id)
        {
            team team = db.teams.Find(id);
            if (team == null)
            {
                return NotFound();
            }

            db.teams.Remove(team);
            db.SaveChanges();

            return Ok(team);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool teamExists(int id)
        {
            return db.teams.Count(e => e.id == id) > 0;
        }
    }
}