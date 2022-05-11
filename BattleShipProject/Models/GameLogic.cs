using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Models
{
    public static class GameLogic
    {
       public static List<Battle> BattleList;

        static GameLogic()
        {
            BattleList = new List<Battle>();
        }
        public static bool RemoveDisconnectedPlayer(Battle battle, List<Battle> battleList) {
            return battleList.Remove(battle);
        }
        public static void AddSocketToEmptyBattle(string socketId , List<Battle> battleList) {

            if (battleList.Count == 0 || battleList.FirstOrDefault(x => x.BattleFields.Count == 1) == null)
            {
                battleList.Add(new Battle(new BattleField() { SocketId = socketId }));
            }
            else {
                battleList.FirstOrDefault(i => i.BattleFields.Count == 1).AddSecondBattleField(new BattleField() { SocketId = socketId });
            }
        
        }

    }
}
