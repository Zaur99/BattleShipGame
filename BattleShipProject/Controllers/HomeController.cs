using BattleShipProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        
       

        [HttpGet]
        public IActionResult BattleFieldSetup()
        {

            return View();
        }

        [HttpPost]
        public IActionResult BattleFieldSetup(GameStartModel model)
        {
            if (ModelState.IsValid)
            {
                TempData["model"] = JsonConvert.SerializeObject(model);
                return RedirectToAction("PlayGameSingle");
            }
            return View();
        }
        public IActionResult PlayGameSingle()
        {
            GameStartModel model;
            if (TempData["model"] != null)
            {
                model = JsonConvert.DeserializeObject<GameStartModel>((string)TempData["model"]);
                return View(model);
            }
            else 
                return RedirectToAction("Index");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
