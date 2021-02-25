require 'rails_helper'

RSpec.describe 'FavoriteProducts' do
  let!(:user) { create(:user) }
  let!(:category) { create(:category) }
  let!(:favorite) { create(:favorite, user_id: user.id) }
  let!(:product) { create(:product, category_id: category.id, user_id: user.id) }
  let!(:favorite_product) { create_list(:favorite_product, 20, product_id: product.id, favorite_id: favorite.id) }
  let(:favorite_id) { favorite.id }
  let(:favorite_product_id) { favorite_product.first.id }
  let(:product_id) { product.id }

  describe 'GET /favorites/:favorite_id/favorite_products' do
    before { get "/favorites/#{favorite_id}/favorite_products" }

    context 'when favorite_products exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
      it 'returns all favorites products' do
        expect(json.size).to eq(20)
      end
    end

    context 'when favorite does not exist' do
      let(:favorite_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Favorite/)
      end
    end
  end

  describe 'GET /favorites/:favorite_id/favorite_products/:id' do
    before { get "/favorites/#{favorite_id}/favorite_products/#{favorite_product_id}" }

    context 'when favorites favorite_products exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns the item' do
        expect(json['id']).to eq(favorite_product_id)
      end
    end

    context 'when user favorite_products does not exist' do
      let(:favorite_product_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find FavoriteProduct/)
      end
    end
  end

  describe 'POST /favorites/:favorite_id/products/:product_id/favorite_products' do
    let(:valid_attributes) { { product_id: product_id, favorite_id: favorite_id } }

    context 'when request attributes are valid' do
      before { post "/favorites/#{favorite_id}/products/#{product_id}/favorite_products" }

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when an invalid request' do
      let(:product_id) { 0 }
      let(:favorite_id) { 0 }
      before { post "/favorites/#{favorite_id}/products/#{product_id}/favorite_products" }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a failure message' do
        expect(response.body).to match(/Validation failed: Favorite must exist, Product must exist/)
      end
    end
  end

  describe 'DELETE /favorite_products/:id' do
    before { delete "/favorite_products/#{favorite_product_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end
