jQuery(init);

function init($) {

    $.ajax({
        url: "./data/data.json",
        type: "GET",
        success: handleRequest,
        statusCode: {
            404: function () {
                alert('There was a problem with the server. Try again soon!');
            }
        }
    });

    function handleRequest(data) {
        const cities = [];
        const hotelnames = [];
        const rating = [];
        const guestrating = [];
        const imgs = [];
        const prices = [];
        const latlongs = [];
        const maps = [];
        const filters = [];
        const hotels = [];
        const ratingz = [];
        const ratno = [];
        const rattext = [];
        const listofhotels = $('#hotels');

        $(data[1].entries).each(function (key, value) {
            hotels.push(value);
            cities.push(value.city);
            hotelnames.push(value.hotelName);
            rating.push(value.rating);
            guestrating.push(value.guestrating);
            imgs.push(value.thumbnail);
            prices.push(value.price);
            latlongs.push(value.latlon);
            maps.push(value.mapurl);
            filters.push(value.filters);
            ratingz.push(value.ratings);
        });

        displayHotels(hotels);

        $(ratingz).each(function (key, val) {
            ratno.push(val.no);
            rattext.push(val.text);
        })

        let uniquecities = [];

        function unique(list) {
            const result = [];
            $.each(list, function (i, e) {
                if ($.inArray(e, result) == -1) result.push(e);
            });
            return result;
        }

        uniquecities = unique(cities);
        $("#autocomplete-city").autocomplete({ source: uniquecities });

        function displayHotels(hotels) {
            listofhotels.empty();
            $.each(hotels, function (key, hotel) {
                const templ = renderHotel(hotel);
                listofhotels.append(templ);
            });
        }

        const priceSlider = $('#priceRange');

        function getFilteredProducts(list, limit) {
            const filterd = list.filter((hotel) => {
                return parseFloat(hotel.price) < limit;
            });
            return filterd;
        }

        priceSlider.on('change', (p) => {
            const filterhot = getFilteredProducts(hotels, p.target.value);
            displayHotels(filterhot);
        });

        priceSlider.on('input',(p)=>{
            // console.log('on input:' + p.target.value);
            $('#pselected').text('$' + p.target.value);
        });

        $('#mapModal').on('shown.bs.modal', function () {
            displayMap(latlongs[1][1], latlongs[1][0]);
        })

        $('#parking').on('click', function () {
            sortedlist = sorter(hotels, 'Car Park');
            displayHotels(sortedlist);
        })

        $('#sauna').on('click', function () {
            sortedlist = sorter(hotels, 'Sauna');
            displayHotels(sortedlist);
        })

        $('#pool').on('click', function () {
            sortedlist = sorter(hotels, 'Pool');
            displayHotels(sortedlist);
        })

        $('#wifi').on('click', function () {
            sortedlist = sorter(hotels, 'Wifi');
            displayHotels(sortedlist);
        })

        $('#balcony').on('click', function () {
            sortedlist = sorter(hotels, 'Balcony');
            displayHotels(sortedlist);
        })

        $(data[0].roomtypes).each(function (k, val) {
            $('#roomtypes').append("<option value='" + val.name + "'></option>");
        });

        $(uniquecities).each(function (k, val) {
            $('#locales').append("<option value='" + val + "'></option>");
        });

        $("#fourstars").on('click', function () {
            const result = [];
            $(hotels).each(function (k, hotel) {
                if (hotel.rating == '4') {
                    result.push(hotel);
                }
            });
            displayHotels(result);
        });

        $("#fivestars").on('click', function () {
            const result = [];
            $(hotels).each(function (k, hotel) {
                if (hotel.rating == '5') {
                    result.push(hotel);
                }
            });
            displayHotels(result);
        });
}

    function sorter(listofhotels, filter) {
        const result = [];
        $.each(listofhotels, function (i, e) {
            // if ($.inArray(e.filters, result) == 'Car Park') result.push(e);
            $.each(e.filters, function (k, val) {
                if (val.name == filter) {
                    result.push(e);
                }
            })
        });
        return result;
    }


    //template logic
    function renderHotel(hotel) {
        const templ = `<div id="hotelcard" class="card mb-3 mt-1 d-flex flexwrap-nowrap">
        <div class="row no-gutters">
            <div class="hotelmedia col-md-3">
                <i class="fa fa-heart-o"></i>
                <img src=${hotel.thumbnail}
                    class="card-img img-fluid" alt="hotel image results">
                    <span class="img-pagin bg-dark rounded">1/30</span>
            </div>
            <div class="col-md-4">
                <div class="card-body border-right" style="height:100%;">
                    <h5 class="card-title">${hotel.hotelName}</h5>
                    <div class="rating">
                        <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                        </div>
                    <p class="card-text">${hotel.city}</p>
                    <p class="card-text d-flex"><strong class="bg-success rounded">${hotel.ratings.no}</strong><strong class="text-muted ml-1">${hotel.ratings.text}</strong></p>
                </div>
            </div>
            <div class="col-md-2 border-right">
                <ul id="deals" style="height:100%; padding:0;">
                    <li id="website1"> </li>
                    <li id="website2"></li>
                    <li id="website3" class="border-bottom"></li>
                    <li id="website4"></li>
                </ul>
            </div>
            <div id="finalprice" class="col-md-3 px-1">
                <p class="text-success mb-0">Hotel Website</p>
                <p class="text-success font-weight-bolder">$${hotel.price}</p>
                <button class="w-100 btn btn-success mb-1">View Deal <i class="fa fa-caret-right"></i></button>
            </div>
        </div>
    </div>`
        return templ;
    }

    $('#checkindate').datepicker().datepicker('setDate', 'today');
    $('#checkoutdate').datepicker().datepicker('setDate', 'today' + 7);

    $('#onedaymore').on('click', function (e) {
        let plusdate = $('#checkindate').datepicker('getDate', '+1d');
        plusdate.setDate(plusdate.getDate() + 1);
        $('#checkindate').datepicker().datepicker('setDate', plusdate);
        e.preventDefault();
    });

    $('#outdaymore').on('click', function (e) {
        let plusdate = $('#checkoutdate').datepicker('getDate', '+1d');
        plusdate.setDate(plusdate.getDate() + 1);
        $('#checkoutdate').datepicker().datepicker('setDate', plusdate);
        e.preventDefault();
    });

    $('#onedayless').on('click', function (e) {
        let minusdate = $('#checkindate').datepicker('getDate', '-1d');
        minusdate.setDate(minusdate.getDate() - 1);
        $('#checkindate').datepicker().datepicker('setDate', minusdate);
        e.preventDefault();
    });

    $('#outdayless').on('click', function (e) {
        let minusdate = $('#checkoutdate').datepicker('getDate', '-1d');
        minusdate.setDate(minusdate.getDate() - 1);
        $('#checkoutdate').datepicker().datepicker('setDate', minusdate);
        e.preventDefault();
    });

    function displayMap(lon, lat) {
        setTimeout(() => {
            const map = new ol.Map({
                target: 'map-modal',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([lon, lat]),
                    zoom: 14
                })
            });
        }, 100);
    }
}