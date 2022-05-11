using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Models
{
    public class BattleField
    {
        public string SocketId { get; set; }
        public string PlayerName { get; set; }
        public string[,] BattleFieldArray { get; set; }
        public bool Ready { get; set; }
        public int CountHits { get; set; }
    }
}
