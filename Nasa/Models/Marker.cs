using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Nasa.Models
{
    public class Marker
    {
        [Key]
        public int Id { get; set; }
        public Point InsertPoint { get; set; }
        public EnergyType Type { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}