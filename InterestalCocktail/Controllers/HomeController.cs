
using InterestalCocktail.Models;
using InterestalCocktail.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace InterestalCocktail.Controllers
{
    public class HomeController : Controller
    {
        cocktailAPI cocktailAPI;
       public HomeController(cocktailAPI _cocktailAPI)
        {
            cocktailAPI = _cocktailAPI;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ExecuteResultModel ExecuteById([FromBody] ExecuteParamModel data)
        {
            var Cocktel = cocktailAPI.SearchCoktelById(int.Parse(data.searchData));
            return new ExecuteResultModel { cocktel = Cocktel.drinks, isError = false };
        }


        [HttpPost]
        public ExecuteResultModel Execute([FromBody] ExecuteParamModel data)
        {
            // Buqueda de cokteles o ingredientes que lleve el cocktel
            var Cocktel = cocktailAPI.SearchCoktel(data.searchData);
            
   
            //Buscamos los ingredientes con el parametro
            var Ingrediente = cocktailAPI.SearchIngrediente(data.searchData);
            
            if (!Ingrediente.isError)
            {
                foreach (Ingrediente item in Ingrediente.drinks)
                {
                    int id = int.Parse( item.idDrink);

                    if (!Cocktel.isError)
                    {
                        Cocktel.drinks = Cocktel.drinks.Concat(cocktailAPI.SearchCoktelById(id).drinks);
                    } else {
                        if (Cocktel.drinks == null)
                        {
                            Cocktel.drinks = cocktailAPI.SearchCoktelById(id).drinks;
                        } else
                        {
                            Cocktel.drinks = Cocktel.drinks.Concat(cocktailAPI.SearchCoktelById(id).drinks);
                        }
                            
                    }


                }
            }


            
            return new ExecuteResultModel { cocktel = Cocktel.drinks, isError = false };
        }

    }
}