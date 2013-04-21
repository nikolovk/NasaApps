using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Nasa.Models
{
    public class Point
    {
        [Key]
        public int Id { get; set; }
        public double longitude { get; set; }
        public double latitude { get; set; }
    }
}