using BattleShipProject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Controllers
{
    public class MultiController : Controller
    {
        public IActionResult BattleFieldSetupMulti()
        {
            return View();
        }

        [HttpPost]
        public IActionResult BattleFieldSetupMulti(GameStartModel model)
        {
            if (ModelState.IsValid)
            {
                TempData["model"] = JsonConvert.SerializeObject(model);
                return RedirectToAction("PlayGameMulti");
            }
            return View();
        }

        public IActionResult PlayGameMulti()
        {
            GameStartModel model;
            if (TempData["model"] != null)
            {
                model = JsonConvert.DeserializeObject<GameStartModel>((string)TempData["model"]);
                return View(model);
            }
            else
                return RedirectToAction("Home","Index");
        }
    }
}
