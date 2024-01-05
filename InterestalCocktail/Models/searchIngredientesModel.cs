using Newtonsoft.Json;

namespace InterestalCocktail.Models
{

    public class Ingrediente
    {
        public string strDrink { get; set; }
        public string strDrinkThumb { get; set; }
        public string idDrink { get; set; }
        public IEnumerable<Cocktel> coktel { get; set; }
    }
    public class searchIngredientesModel : resultModel
    {
        public IEnumerable<Ingrediente> drinks { get; set; }
        public searchIngredientesModel()
        {
            isError = false;
            message = "Se completo correctamente.";
        }
    }
}
