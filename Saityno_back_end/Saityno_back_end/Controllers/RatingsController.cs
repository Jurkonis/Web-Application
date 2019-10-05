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
    public class RatingsController : ApiController
    {
        private saitynasEntities2 db = new saitynasEntities2();


        [ResponseType(typeof(rating))]
        public IHttpActionResult Getrating(int id)
        {
            rating rating = db.ratings.Find(id);
            if (rating == null)
            {
                return NotFound();
            }

            return Ok(rating);
        }

		[Authorize(Roles = "user")]
		[ResponseType(typeof(void))]
        public IHttpActionResult Putrating(int id, rating rate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			rating rating = db.ratings.Find(id);
			rating.times_rated+=1;
			rating.total += rate.total;

            db.Entry(rating).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ratingExists(id))
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

		[Authorize(Roles = "user")]
		[ResponseType(typeof(rating))]
        public IHttpActionResult Postrating(rating rating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			player player=db.players.Find(rating.id);
			if(player ==null)
			{
				return NotFound();
			}

			player.fk_rating = rating.id;
			db.Entry(player).State = EntityState.Modified;

			db.ratings.Add(rating);
            db.SaveChanges();

			return Ok(rating);
		}

		[Authorize(Roles = "admin,manager")]
		[ResponseType(typeof(rating))]
        public IHttpActionResult Deleterating(int id)
        {
            rating rating = db.ratings.Find(id);
            if (rating == null)
            {
                return NotFound();
            }

            db.ratings.Remove(rating);
            db.SaveChanges();

            return Ok(rating);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ratingExists(int id)
        {
            return db.ratings.Count(e => e.id == id) > 0;
        }
    }
}