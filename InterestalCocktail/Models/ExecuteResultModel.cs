namespace InterestalCocktail.Models
{
    public class ExecuteResultModel: resultModel
    {
        public IEnumerable<Cocktel> cocktel { get; set; }
        public ExecuteResultModel()
        {
            isError = false;
            message = "Se completo correctamente.";
        }
    }
}
