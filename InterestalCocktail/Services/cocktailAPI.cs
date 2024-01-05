using InterestalCocktail.Models;
using Newtonsoft.Json;

namespace InterestalCocktail.Services
{

    public class cocktailAPI
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public cocktailAPI(IHttpClientFactory httpClientFactory) =>
        _httpClientFactory = httpClientFactory;

        //www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita

        public searchIngredientesModel SearchIngrediente(string data)
        {
            try
            {
                var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "")
                {
                    Headers = { { "Accept", "application/json" }, { "User-Agent", "HttpRequestsConsoleSample" } }
                };

                httpRequestMessage.RequestUri = new Uri("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + data);

                var httpClient = _httpClientFactory.CreateClient();
                var httpResponseMessage = httpClient.Send(httpRequestMessage);
                httpResponseMessage.EnsureSuccessStatusCode();


                StreamReader streamReader = new StreamReader(httpResponseMessage.Content.ReadAsStream());
                var returnStream = streamReader.ReadToEnd();

                if (returnStream == String.Empty)
                {
                    return new searchIngredientesModel { isError = true, message = "no hay Ingredientes" };
                } else
                {
                    return JsonConvert.DeserializeObject<searchIngredientesModel>(returnStream);
                }

                
            }
            catch (Exception e)
            {
                return new searchIngredientesModel { isError = true, message = e.Message };
            }
        }

        public searchCoktelModel SearchCoktel(string data)
        {
            try
            {
                var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "")
                {
                    Headers = { { "Accept", "application/json" }, { "User-Agent", "HttpRequestsConsoleSample" } }
                };

                httpRequestMessage.RequestUri = new Uri("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + data);

                var httpClient = _httpClientFactory.CreateClient();
                var httpResponseMessage = httpClient.Send(httpRequestMessage);
                httpResponseMessage.EnsureSuccessStatusCode();


                StreamReader streamReader = new StreamReader(httpResponseMessage.Content.ReadAsStream());
                var resultStream = streamReader.ReadToEnd();

                if (resultStream == String.Empty || resultStream.Contains("\"drinks\":null"))
                {
                    return new searchCoktelModel { isError = true, message = "No hay cockteles" };
                } else{
                    return JsonConvert.DeserializeObject<searchCoktelModel>(resultStream);
                }

                    
            }
            catch (Exception e)
            {
                return new searchCoktelModel { isError = true, message = e.Message };
            }
        }

        public searchCoktelModel SearchCoktelById(int id)
        {
            try
            {
                var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "")
                {
                    Headers = { { "Accept", "application/json" }, { "User-Agent", "HttpRequestsConsoleSample" } }
                };

                httpRequestMessage.RequestUri = new Uri("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id);

                var httpClient = _httpClientFactory.CreateClient();
                var httpResponseMessage = httpClient.Send(httpRequestMessage);
                httpResponseMessage.EnsureSuccessStatusCode();


                StreamReader streamReader = new StreamReader(httpResponseMessage.Content.ReadAsStream());
                var resultStream = streamReader.ReadToEnd();
                return JsonConvert.DeserializeObject<searchCoktelModel>(resultStream);
            }
            catch (Exception e)
            {
                return new searchCoktelModel { isError = true, message = e.Message };
            }
        }
    }
}
