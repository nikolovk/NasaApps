using Nasa.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Nasa.Controllers
{
    public class DataController : Controller
    {
        JustDb db = new JustDb();

        //Show upload Marker form
        [Authorize]
        public ActionResult UploadMarker()
        {
            return View("UploadMarker", "~/Views/Shared/_LayoutAdmin.cshtml");
        }

        // Show upload form
        [Authorize]
        public ActionResult Upload()
        {
            return View("Upload", "~/Views/Shared/_LayoutAdmin.cshtml");
        }

        //Add marker in DB
        [Authorize]
        [HttpPost]
        public ActionResult AddMarker(Marker formMarker)
        {
            Point point = new Point();
            point.longitude = formMarker.InsertPoint.longitude;
            point.latitude = formMarker.InsertPoint.latitude;
            Marker marker = new Marker
            {
                Title = formMarker.Title,
                Type = formMarker.Type,
                Content = formMarker.Content,
                InsertPoint = point,
            };
            //db.Markers.Add(marker);
            db.SaveChanges();
            return Redirect("/Administration/Data/UploadMarker");
        }

        //Make upload in database
        [Authorize]
        [HttpPost]
        public ActionResult UploadPolygon(string pointsText, Area areaForUpload)
        {
            string[] pointArray = pointsText.Split(';');
            List<Point> points = new List<Point>();
            foreach (var pointValue in pointArray)
            {
                Point point = new Point();
                string[] pointCoords = pointValue.Split(',');
                point.longitude = double.Parse(pointCoords[0]);
                point.latitude = double.Parse(pointCoords[1]);
                points.Add(point);
            }
            Area area = new Area
            {
                Type = areaForUpload.Type,
                Rate = areaForUpload.Rate,
                Polygon = points,
                Name = areaForUpload.Name,
                MagicValue = areaForUpload.MagicValue,
            };
            db.Areas.Add(area);
            db.SaveChanges();
            return Redirect("/Administration/Data/Upload");
        }

        //Show polygon list
        [Authorize]
        public ActionResult PolygonList()
        {
            var allPolygons = db.Areas
                .Select(x => new ViewArea
                {
                    Id = x.Id,
                    Type = x.Type,
                    Rate = x.Rate,
                });
            return View(allPolygons);
        }

        //Return json array with polygons
        [HttpGet]
        public ActionResult GetPolygon(EnergyType type)
        {
            var polygons = db.Areas
                .Where(x => x.Type == type)
                .Select(x => new ViewArea
                {
                    Id = x.Id,
                    Type = x.Type,
                    Rate = x.Rate,
                    Points = x.Polygon,
                });
            return Json(polygons, JsonRequestBehavior.AllowGet);
        }

        //private IEnumerable<Tuple<double?, double?>> PolygonToTuple(DbGeography polygon)
        //{
        //    List<Tuple<double?, double?>> pointsList = new List<Tuple<double?, double?>>();
        //    int length = (int)polygon.ElementCount;
        //    for (int i = 1; i <= length; i++)
        //    {
        //        Tuple<double?, double?> point = new Tuple<double?, double?>(polygon.ElementAt(i).Longitude, polygon.ElementAt(i).Latitude);
        //        pointsList.Add(point);
        //    }
        //    return pointsList;
        //}
    }
}
