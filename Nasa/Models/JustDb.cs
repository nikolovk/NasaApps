using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Nasa.Models
{
    public class JustDb : DbContext
    {
        public JustDb() :
            base("DefaultConnection")
        {
        }

        public DbSet<Area> Areas { get; set; }
        //public DbSet<Marker> Markers { get; set; }
    }
}