using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Models
{
    public class GameStartModel
    {
        [Required(ErrorMessage = "You forgot your name!")]
        public string PlayerName { get; set; }
        [ValidateArray]
        public string SerializedBattleFieldArray { get; set; }
    }
}
