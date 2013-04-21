using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Data.Entity.Spatial;

namespace Nasa.Models
{
    public class ViewArea
    {
        public int Id { get; set; }
        public EnergyType Type { get; set; }
        public int Rate { get; set; }
        public List<Point> Points { get; set; }
    }
}