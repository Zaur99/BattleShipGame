using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Models
{
    public class Battle
    {
        public string PlayerSocketTurn;
        public List<BattleField> BattleFields { get; set; }

        public Battle(BattleField bf)
        {
            BattleFields = new List<BattleField>();
            BattleFields.Add(bf);
        }


        public void AddSecondBattleField(BattleField secondBattleField)
        {
            BattleFields.Add(secondBattleField);
            PlayerSocketTurn = BattleFields[1].SocketId;
        
        }
        public bool IsPlayersTurn(string senderSocketId) {
            if (senderSocketId == PlayerSocketTurn)
            {
                return true;
            }
            else
                 return false;
        }
        public bool Shoot(string socketId, string x, string y) {
            BattleField battleF = BattleFields.FirstOrDefault(bf => bf.SocketId != socketId);

            string bfValue = battleF.BattleFieldArray[Convert.ToInt32(x), Convert.ToInt32(y)];
            PlayerSocketTurn = battleF.SocketId;

            if (bfValue != "" && bfValue != "m")
            {
                battleF.CountHits++;
                return true;
            }
            else {

                bfValue = "m";
                return false;
            }
        
        }
        public bool IsGameOver() {
            foreach (var item in BattleFields)
            {
                if (item.CountHits >= 16)
                {
                    return true;
                }
            }
            return false;
        }
        public string GetWinnerName() {
            foreach (var item in BattleFields)
            {
                if (item.CountHits >= 16)
                {
                    return item.PlayerName;
                }
            }
            return null;
        }
        public bool IsGameReady() {
            int counter = 0;
            foreach (var item in BattleFields)
            {
                if (item.Ready)
                {
                    counter++;
                }
                if (counter == 2)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
